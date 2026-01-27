
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { vi } from "vitest";
import { BASE_URL } from "../../../../../src/core/constants";

describe("german text block", () => {
    it("should handle a block of German text", async () => {
        const germanTextBlock = 'Eilmeldungen\nSport\nBerlin\nChemnitz\nDresden\nErfurt\nFrankfurt/Main\nHamburg\nKöln\nLeipzig\nMagdeburg\nMünchen\nStuttgart\nDeutschland\n';

        const mockFetchDataFn = vi.fn().mockResolvedValue(JSON.stringify([]));

        await retrieveRecordings(
            germanTextBlock,
            "de",
            undefined,
            undefined,
            mockFetchDataFn
        );
        expect(mockFetchDataFn).toHaveBeenCalledWith({
            remoteSiteUrl: `${BASE_URL}/pronunciations/${encodeURIComponent(germanTextBlock)}?code=de`,
            msg: "json",
        });
    });
});
