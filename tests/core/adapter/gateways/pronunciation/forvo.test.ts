
import { retrieveRecordings } from "../../../../../src/core/adapter/gateways/pronunciation/forvo";
import { vi } from "vitest";
import { Pronunciation } from "../../../../../src/core/domain/entities/model";

describe("forvo", () => {
    it("should retrieve recordings and sort them", async () => {
        const mockJsonResponse = [
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

        const mockFetchDataFn = vi.fn().mockResolvedValue(JSON.stringify(mockJsonResponse));

        const mockLoadJsonResponseFn = vi.fn(async (url, fetchDataFn) => {
            const jsonResponse = await fetchDataFn({ remoteSiteUrl: url, msg: "json" });
            return JSON.parse(String(jsonResponse));
        });

        const mockLoadPronunciationsFn = vi.fn(async (url, loadJsonResponseFn, fetchDataFn) => {
            const response = await loadJsonResponseFn(url, fetchDataFn);
            return response.map((element: any) => new Pronunciation(
                element["title"],
                element["url"],
                element["tags"],
                element["translation"],
            ));
        });

        const result = await retrieveRecordings(
            "word",
            "en",
            mockLoadPronunciationsFn,
            mockLoadJsonResponseFn,
            mockFetchDataFn
        );

        expect(mockFetchDataFn).toHaveBeenCalledWith({
            remoteSiteUrl: "http://localhost:9999/pronunciations/word?code=en",
            msg: "json",
        });

        expect(mockLoadJsonResponseFn).toHaveBeenCalledWith(
            "http://localhost:9999/pronunciations/word?code=en",
            mockFetchDataFn
        );

        expect(mockLoadPronunciationsFn).toHaveBeenCalledWith(
            "http://localhost:9999/pronunciations/word?code=en",
            mockLoadJsonResponseFn,
            mockFetchDataFn
        );

        expect(result).toEqual([
            new Pronunciation("short", "url1", "tag1", "translation1"),
            new Pronunciation("long title", "url2", "tag2", "translation2"),
        ]);
    });
});
