from brownie import BrydgeCollection, accounts, config


def main():
    dev = accounts.add(config['wallets']['from_key'])
    BrydgeCollection.deploy(
        {'from': dev}
    )
