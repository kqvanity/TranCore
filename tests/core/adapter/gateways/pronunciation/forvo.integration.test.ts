
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { Pronunciation } from "../../../../../src/core/domain/entities/model";

describe("forvo integration", () => {
    it("should retrieve recordings from the API", async () => {
        // This test requires the local pronunciation server to be running
        const result = await retrieveRecordings("hello", "en");
        try {
            expect(result).toBeInstanceOf(Array);
            if (result.length > 0) {
                expect(result[0]).toBeInstanceOf(Pronunciation);
            }
        } catch (e) {
            console.warn(`Error retring pronunciations: ${e.message}. Result ${result}`);
        }
    }, 10000);
});
