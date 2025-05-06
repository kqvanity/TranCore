import { retrieveRecordings } from '../src/pages/content/pronunciation/forvo'

describe('testing forvo', () => {
    test('load pronunciations', () => {
        expect(retrieveRecordings("keine", "de"))
    })
})