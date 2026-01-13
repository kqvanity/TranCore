
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { fetchData } from "../../../../../src/core/adapter/gateways/fetch";
import { vi } from "vitest";
import { Pronunciation } from "../../../../../src/core/domain/entities/model";

vi.mock("../../../../../src/core/adapter/gateways/fetch", () => {
    return {
        fetchData: vi.fn(),
    };
});

describe("forvo", () => {
    it("should retrieve recordings and sort them", async () => {
        const mockResponse = [
            {
                title: "long title",
                url: "url2",
                tags: "tag2",
                translation: "translation2",
            },
            {
                title: "short",
                url: "url1",
                tags: "tag1",
                translation: "translation1",
            },
        ];
        const mockedFetch = fetchData as vi.MockedFunction<typeof fetchData>;
        mockedFetch.mockResolvedValue(JSON.stringify(mockResponse));

        const result = await retrieveRecordings("word", "en");

        expect(fetchData).toHaveBeenCalledWith({
            remoteSiteUrl: "http://localhost:9999/pronunciations/word?code=en",
            msg: "json",
        });

        expect(result).toEqual([
            new Pronunciation("short", "url1", "tag1", "translation1"),
            new Pronunciation("long title", "url2", "tag2", "translation2"),
        ]);
    });
});
