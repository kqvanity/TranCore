
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { vi } from "vitest";
import { Pronunciation } from "../../../../../src/core/domain/entities/model";

describe("german words", () => {
    it("should retrieve recordings for a list of German words", async () => {
        const germanWords = [
            "Eilmeldungen",
            "Sport",
            "Berlin",
            "Chemnitz",
            "Dresden",
            "Erfurt",
            "Frankfurt/Main",
            "Hamburg",
            "Köln",
            "Leipzig",
            "Magdeburg",
            "München",
            "Stuttgart",
            "Deutschland",
        ];

        const mockFetchDataFn = vi.fn().mockResolvedValue(JSON.stringify([]));

        for (const word of germanWords) {
            await retrieveRecordings(
                word,
                "de",
                undefined,
                undefined,
                mockFetchDataFn
            );
            expect(mockFetchDataFn).toHaveBeenCalledWith({
                remoteSiteUrl: `http://localhost:9999/pronunciations/${encodeURIComponent(word)}?code=de`,
                msg: "json",
            });
        }
    });
});
