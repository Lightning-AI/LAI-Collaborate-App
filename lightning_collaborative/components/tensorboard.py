import os
import subprocess
import time

from lightning import BuildConfig, LightningFlow, LightningWork
from lightning.storage import Path


class TensorBoard(LightningFlow):
    def __init__(self, log_dir: Path, sync_every_n_seconds: int = 5) -> None:
        """This TensorBoard component synchronizes the log directory of an experiment and starts up the server.

        Args:
            log_dir: The path to the directory where the TensorBoard log-files will appear.
            sync_every_n_seconds: How often to sync the log directory (given as an argument to the run method)
        """
        super().__init__()
        self.worker = TensorBoardWorker(
            log_dir=log_dir, sync_every_n_seconds=sync_every_n_seconds
        )

    def run(self) -> None:
        self.worker.run()


class TensorBoardWorker(LightningWork):
    def __init__(self, log_dir: Path, sync_every_n_seconds: int = 5) -> None:
        super().__init__(
            cloud_build_config=BuildConfig(requirements=["tensorboard"]), parallel=True
        )
        self.log_dir = log_dir
        self._sync_every_n_seconds = sync_every_n_seconds

    def run(self) -> None:
        if not self.log_dir.exists_local():
            os.makedirs(self.log_dir, exist_ok=True)
        subprocess.Popen(
            [
                "tensorboard",
                "--logdir",
                str(self.log_dir),
                "--host",
                self.host,
                "--port",
                str(self.port),
            ]
        )

        # Download the log directory periodically
        while True:
            time.sleep(self._sync_every_n_seconds)
            if self.log_dir.exists_remote():
                self.log_dir.get(overwrite=True)
