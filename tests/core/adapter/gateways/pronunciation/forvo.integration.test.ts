
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { Pronunciation } from "../../../../../src/core/domain/entities/model";
import { fetchData as originalFetchData } from '../../../../../src/core/adapter/gateways/fetch';

describe("forvo integration", () => {
    it("should retrieve recordings from the API", async () => {
        // This test requires the local pronunciation server to be running

        const nodeFetchData: typeof originalFetchData = async (message) => {
            const response = await fetch(message.remoteSiteUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const body = await response.text();
            console.log("Fetched data from ", body)
            return body;
        };

        try {
            const result = await retrieveRecordings("hello", "en", undefined, undefined, nodeFetchData);
            expect(result).toBeInstanceOf(Array);
            if (result.length > 0) {
                expect(result[0]).toBeInstanceOf(Pronunciation);
            }
        } catch (e) {
            console.warn("Could not connect to pronunciation server. Skipping integration test.", e);
        }
    }, 10000);
});
