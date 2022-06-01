import json
from pathlib import Path
from brownie import (
    accounts,
    config,
    BrydgeCollection,
)
from scripts.create_metadata import write_metadata


def main():
    brydge_collection = BrydgeCollection[-1]
    existing_tokens = brydge_collection.tokenCounter()
    print(existing_tokens, ' tokens have been minted')
    meta_data_hashes = write_metadata(3)
    print('these are metadatahashes: ', meta_data_hashes)