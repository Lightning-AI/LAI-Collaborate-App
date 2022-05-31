import json
import os
from typing import Optional

from lightning import CloudCompute, LightningApp, LightningFlow
from lightning.frontend import StaticWebFrontend
from lightning.storage import Path

from lightning_collaborative.components.env_checker import EnvironmentChecker
from lightning_collaborative.components.script import CollaborativeLightningRunner
from lightning_collaborative.components.tensorboard import TensorBoard


class TrainFlow(LightningFlow):
    def __init__(self, debug: bool):
        super().__init__()
        self.debug = debug
        self.invite_link = None
        self.share_link = None
        self.devices = None
        self.power_sgd = None
        self.optimize_memory = None
        self.optimize_communication = None
        self.batch_size = None
        self.start_setup = False
        self.discovered_devices = EnvironmentChecker.local_devices()
        self.local_devices_available = self.discovered_devices > 0
        self.logs = None
        self.start_multi_process = False
        self.initial_peers = None

    def _parse_invite_link(self):
        if self.invite_link:
            # example format of the link:
            # collaborative?ip4....,ip4...?optimize...
            self.initial_peers = self.invite_link.split("?")[1].split(",")

    def _set_share_link(self):
        if hasattr(self, "work_0") and self.work_0.peers is not None:
            config = dict(
                powerSGD=self.power_sgd,
                optimizeMemory=self.optimize_memory,
                optimizeCommunication=self.optimize_communication,
                batchSize=self.batch_size,
            )
            return f"collaborative?{','.join(self.work_0.peers)}?config={json.dumps(config)}"
        return "Waiting for training to begin."

    def run(self):
        if self.train_work_logs:
            # todo: we only look at the logs from the first work
            self.logs = self.train_work_logs
        if self.start_setup:
            self._parse_invite_link()
            self._start_initial_train_work()
            self.start_multi_process = self.devices > 1
            self.start_setup = False
        if self.start_multi_process:
            if self.initial_peers is None and self.work_0.peers:
                # assign initial peers by the first work.
                self.initial_peers = self.work_0.peers
            if self.initial_peers:
                for device in range(1, self.devices):
                    self._start_work(device)
                self.start_multi_process = False
        self.share_link = self._set_share_link()

    @property
    def train_work_logs(self) -> Optional[str]:
        if hasattr(self, "work_0"):
            return self.work_0.logs

    def _start_initial_train_work(self):
        self._start_work(device=0)

    def _start_work(self, device):
        if not hasattr(self, f"work_{device}"):
            setattr(
                self,
                f"work_{device}",
                CollaborativeLightningRunner(
                    script_path="train.py",
                    run_once=False,
                    parallel=True,
                    debug=self.debug,
                    cloud_compute=CloudCompute(name="gpu"),
                ),
            )
        getattr(self, f"work_{device}").run(
            root_flow_cuda_available=self.local_devices_available,
            device=device,
            server=(not self.invite_link) and (device == 0),
            peers=self.initial_peers,
            power_sgd=self.power_sgd,
            optimize_memory=self.optimize_memory,
            optimize_communication=self.optimize_communication,
            batch_size=self.batch_size,
        )


class ReactUI(LightningFlow):
    def configure_layout(self):
        return StaticWebFrontend(str(Path(__file__).parent / "ui/build"))


class RootFlow(LightningFlow):
    def __init__(self):
        super().__init__()
        debug = os.environ.get("DEBUG", str(0)) == str(1)
        self.react_ui = ReactUI()
        self.train_flow = TrainFlow(debug=debug)

    def run(self):
        self.react_ui.run()
        self.train_flow.run()
        if self.train_flow.logs:
            # training has started, let's start the tensorboard logger
            if not getattr(self, "logger_component", None):
                logger_component = TensorBoard(log_dir=self.train_flow.work_0.log_dir)
                if logger_component is not None:
                    setattr(self, "logger_component", logger_component)
            else:
                self.logger_component.run()

    def configure_layout(self):
        tabs = [{"name": "Train", "content": self.react_ui}]
        if hasattr(self, "logger_component"):
            tabs.extend(self.logger_component.configure_layout())
        return tabs


app = LightningApp(root=RootFlow())
