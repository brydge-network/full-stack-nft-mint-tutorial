from brownie import WaterCollection, accounts, config


def main():
    dev = accounts.add(config['wallets']['from_key'])
    WaterCollection.deploy(
        {'from': dev}
    )
