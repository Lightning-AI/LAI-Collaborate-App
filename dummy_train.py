import multiprocessing as mp
import time

import pytorch_lightning as pl
from lightning_transformers.task.nlp.language_modeling import (
    LanguageModelingDataConfig,
    LanguageModelingDataModule,
    LanguageModelingTransformer,
)
from pytorch_lightning.strategies import CollaborativeStrategy
from transformers import AutoTokenizer


def run():
    class MyTransformer(LanguageModelingTransformer):
        def training_step(self, batch, batch_idx):
            time.sleep(0.5)
            return super().training_step(batch, batch_idx)

    tokenizer = AutoTokenizer.from_pretrained(
        pretrained_model_name_or_path="sshleifer/tiny-gpt2"
    )
    model = MyTransformer(pretrained_model_name_or_path="sshleifer/tiny-gpt2")
    dm = LanguageModelingDataModule(
        cfg=LanguageModelingDataConfig(
            batch_size=2,
            dataset_name="wikitext",
            dataset_config_name="wikitext-2-raw-v1",
        ),
        tokenizer=tokenizer,
    )
    trainer = pl.Trainer(
        accelerator="auto",
        devices=1,
        max_epochs=100,
        strategy=CollaborativeStrategy(verbose=True, target_batch_size=128),
    )

    trainer.fit(model, dm)


if __name__ == "__main__":
    process = mp.Process(target=run)
    process.start()
    process.join()
