import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
import { describe } from "mocha";
describe("memory-counter contract test suite", () => {
  let counterClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    counterClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.memory-counter", "memory-counter", provider);
  });
  it("should have a valid syntax", async () => {
    await counterClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getCounter = async () => {
      const query = counterClient.createQuery({
        method: { name: "get-memory-counter", args: [] }
      });
      const receipt = await counterClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
    const execMethod = async (method: string) => {
      const tx = counterClient.createTransaction({
        method: {
          name: method,
          args: [],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await counterClient.submitTransaction(tx);
      return receipt;
    }
    const setCounterMethod = async (newCount: string) => {
      const tx = counterClient.createTransaction({
        method: {
          name: 'set-memory-counter',
          args: [newCount],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await counterClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await counterClient.deployContract();
    });
    it("should start at zero", async () => {
      const counter = await getCounter();
      assert.equal(counter, 0);
    })
    it("should un-double", async () => {
      await execMethod("un-double");
      assert.equal(await getCounter(), 1);
      await execMethod("un-double");
      assert.equal(await getCounter(), 2);
      await execMethod("un-double");
      assert.equal(await getCounter(), 4);
      await execMethod("un-double");
      assert.equal(await getCounter(), 8);
    })
    it("should do-double", async () => {
      await execMethod("do-double");
      assert.equal(await getCounter(), 4);
      await execMethod("do-double");
      assert.equal(await getCounter(), 2);
      await execMethod("do-double");
      assert.equal(await getCounter(), 1);
      await execMethod("do-double");
      assert.equal(await getCounter(), 0);
      await execMethod("do-double");
      assert.equal(await getCounter(), 0);
    })
    it("should set counter", async () => {
      await setCounterMethod("1024");
      assert.equal(await getCounter(), 1024);
    })
    it("should do-double", async () => {
      await execMethod("do-double");
      assert.equal(await getCounter(), 512);
    })

    it("should not set counter", async () => {
      await setCounterMethod("-777");
      assert.equal(await getCounter(), 512);//no change due to wrong number
    })

  });
  after(async () => {
    await provider.close();
  });
});
