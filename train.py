import os
import time

import fire


def main(*args, **kwargs):
    print(args, kwargs, flush=True)
    print("device", os.environ["CUDA_VISIBLE_DEVICES"])
    count = 0

    while True:
        print(count, flush=True)
        count += 1
        time.sleep(1)


if __name__ == "__main__":
    fire.Fire(main)
