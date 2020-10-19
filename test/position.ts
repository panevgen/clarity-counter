import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
import { describe } from "mocha";
describe("memory-counter contract test suite", () => {
  let positionClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    positionClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.position", "position", provider);
  });
  it("should have a valid syntax", async () => {
    await positionClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getPositionStatus = async () => {
      const query = positionClient.createQuery({
        method: { name: "get-position-status", args: [] }
      });
      const receipt = await positionClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const applyToPosition = async (preSalary: string, preYearsOfExperience: string) => {
      const tx = positionClient.createTransaction({
        method: {
          name: 'apply',
          args: [preSalary, preYearsOfExperience],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await positionClient.submitTransaction(tx);
      return receipt;
    }

    before(async () => {
      await positionClient.deployContract();
    });
    
    it("Position should be open", async () => {
      const status = await getPositionStatus();
      assert.equal(status, 1);
    })
    it("should apply to position", async () => {
      await applyToPosition("30", "10");
    })
    it("Position should be closed", async () => {
      const status = await getPositionStatus();
      assert.equal(status, 0);
    })

  });
  after(async () => {
    await provider.close();
  });
});
