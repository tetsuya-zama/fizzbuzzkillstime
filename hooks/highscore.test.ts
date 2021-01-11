import { renderHook, act} from '@testing-library/react-hooks';
import {HighScore,isNewHighScoreOf, newScoreOf, useHighScore, HighScoreRepository} from './highscore';

describe('isNewHighScore function', () => {
    it('returns true if count of the current highscore is less than 10', () => {
        const currentHighscore: HighScore = [
            {rank:1, score:{value: 100, datetime: new Date()}},
            {rank:2, score:{value: 90, datetime: new Date()}},
            {rank:3, score:{value: 80, datetime: new Date()}},
            {rank:4, score:{value: 70, datetime: new Date()}},
            {rank:5, score:{value: 60, datetime: new Date()}},
            {rank:6, score:{value: 50, datetime: new Date()}},
            {rank:7, score:{value: 40, datetime: new Date()}},
            {rank:8, score:{value: 30, datetime: new Date()}},
            {rank:9, score:{value: 20, datetime: new Date()}},
        ];

        expect(isNewHighScoreOf(currentHighscore)({value:10, datetime: new Date()})).toBe(true);
    });

    it('returns true if new score value is more than or equal to minimun value of current highscore', () => {
        const currentHighscore: HighScore = [
            {rank:1, score:{value: 100, datetime: new Date()}},
            {rank:2, score:{value: 90, datetime: new Date()}},
            {rank:3, score:{value: 80, datetime: new Date()}},
            {rank:4, score:{value: 70, datetime: new Date()}},
            {rank:5, score:{value: 60, datetime: new Date()}},
            {rank:6, score:{value: 50, datetime: new Date()}},
            {rank:7, score:{value: 40, datetime: new Date()}},
            {rank:8, score:{value: 30, datetime: new Date()}},
            {rank:9, score:{value: 20, datetime: new Date()}},
            {rank:10, score:{value: 10, datetime: new Date()}},
        ];

        expect(isNewHighScoreOf(currentHighscore)({value:11, datetime: new Date()})).toBe(true);
        expect(isNewHighScoreOf(currentHighscore)({value:10, datetime: new Date()})).toBe(true);
    });

    it("returns false if new value is less than minimum of current highscore", () => {
        const currentHighscore: HighScore = [
            {rank:1, score:{value: 100, datetime: new Date()}},
            {rank:2, score:{value: 90, datetime: new Date()}},
            {rank:3, score:{value: 80, datetime: new Date()}},
            {rank:4, score:{value: 70, datetime: new Date()}},
            {rank:5, score:{value: 60, datetime: new Date()}},
            {rank:6, score:{value: 50, datetime: new Date()}},
            {rank:7, score:{value: 40, datetime: new Date()}},
            {rank:8, score:{value: 30, datetime: new Date()}},
            {rank:9, score:{value: 20, datetime: new Date()}},
            {rank:10, score:{value: 10, datetime: new Date()}},
        ];

        expect(isNewHighScoreOf(currentHighscore)({value:9, datetime: new Date()})).toBe(false);
    });
});

describe("newScore function", () => {
    it("updates highscore object if the new score is highscore", ()=>{
        const currentHighscore: HighScore = [];
        const setHighScore = jest.fn();
        const onHighScoreUpdated = {fn:jest.fn()};

        const score = {value:100, datetime: new Date()};

        newScoreOf(currentHighscore,setHighScore,onHighScoreUpdated)(score);

        const expectedHighscore = [
            {rank:1, score}
        ];

        expect(setHighScore).toBeCalledWith(expectedHighscore);
        expect(onHighScoreUpdated.fn).toBeCalledWith(expectedHighscore, score);
    });

    it("does nothing if the new score is not highscore", () => {
        const currentHighscore: HighScore = [
            {rank:1, score:{value: 100, datetime: new Date()}},
            {rank:2, score:{value: 90, datetime: new Date()}},
            {rank:3, score:{value: 80, datetime: new Date()}},
            {rank:4, score:{value: 70, datetime: new Date()}},
            {rank:5, score:{value: 60, datetime: new Date()}},
            {rank:6, score:{value: 50, datetime: new Date()}},
            {rank:7, score:{value: 40, datetime: new Date()}},
            {rank:8, score:{value: 30, datetime: new Date()}},
            {rank:9, score:{value: 20, datetime: new Date()}},
            {rank:10, score:{value: 10, datetime: new Date()}},
        ];
        const setHighScore = jest.fn();
        const onHighScoreUpdated = {fn:jest.fn()};

        const score = {value:9, datetime: new Date()};

        newScoreOf(currentHighscore,setHighScore,onHighScoreUpdated)(score);

        expect(setHighScore).not.toBeCalled();
        expect(onHighScoreUpdated.fn).not.toBeCalled();
    });

    test("num of the highscore will not to be over than 10",() => {
        const datetime = new Date();
        const currentHighscore: HighScore = [
            {rank:1, score:{value: 100, datetime}},
            {rank:2, score:{value: 90, datetime}},
            {rank:3, score:{value: 80, datetime}},
            {rank:4, score:{value: 70, datetime}},
            {rank:5, score:{value: 60, datetime}},
            {rank:6, score:{value: 50, datetime}},
            {rank:7, score:{value: 40, datetime}},
            {rank:8, score:{value: 30, datetime}},
            {rank:9, score:{value: 20, datetime}},
            {rank:10, score:{value: 10, datetime}}
        ];
        const setHighScore = jest.fn();
        const onHighScoreUpdated = {fn:jest.fn()};

        const score = {value:91, datetime};

        newScoreOf(currentHighscore,setHighScore,onHighScoreUpdated)(score);

        const expectedHighscore = [
            {rank:1, score:{value: 100, datetime}},
            {rank:2, score:{value: 91, datetime}},
            {rank:3, score:{value: 90, datetime}},
            {rank:4, score:{value: 80, datetime}},
            {rank:5, score:{value: 70, datetime}},
            {rank:6, score:{value: 60, datetime}},
            {rank:7, score:{value: 50, datetime}},
            {rank:8, score:{value: 40, datetime}},
            {rank:9, score:{value: 30, datetime}},
            {rank:10, score:{value: 20, datetime}}
        ];

        expect(setHighScore).toBeCalledWith(expectedHighscore);
        expect(onHighScoreUpdated.fn).toBeCalledWith(expectedHighscore, score);
    });
});

describe("useHighScore hook", () => {
    it("loads saved highscore from repository", async () => {
        const datetime = new Date();
        const storedHighscore = [
            {rank:1, score:{value: 100, datetime}},
            {rank:2, score:{value: 90, datetime}},
            {rank:3, score:{value: 80, datetime}},
        ];
        const mockHighScoreRepository: HighScoreRepository = {
            save: jest.fn().mockResolvedValue(undefined),
            load: jest.fn().mockResolvedValue(storedHighscore)
        };

        const {result, waitForNextUpdate} = renderHook(() => useHighScore(mockHighScoreRepository));

        await waitForNextUpdate();

        expect(result.current.highscore).toBe(storedHighscore);
        expect(mockHighScoreRepository.save).toBeCalledWith(storedHighscore);
        expect(mockHighScoreRepository.load).toBeCalledTimes(1);
    });

    describe("newScore function", () => {
        it("updates and save new highsocre if the new score is highscore", async() => {
            const datetime = new Date();
            const storedHighscore = [
                {rank:1, score:{value: 100, datetime}},
                {rank:2, score:{value: 90, datetime}},
                {rank:3, score:{value: 80, datetime}},
            ];
            const mockHighScoreRepository: HighScoreRepository = {
                save: jest.fn().mockResolvedValue(undefined),
                load: jest.fn().mockResolvedValue(storedHighscore)
            };
    
            const {result, waitForNextUpdate} = renderHook(() => useHighScore(mockHighScoreRepository));
    
            await waitForNextUpdate();

            act(() => result.current.newScore({value: 101, datetime}));

            const expectedHighscore = [
                {rank:1, score:{value: 101, datetime}},
                {rank:2, score:{value: 100, datetime}},
                {rank:3, score:{value: 90, datetime}},
                {rank:4, score:{value: 80, datetime}},
            ];

            expect(result.current.highscore).toStrictEqual(expectedHighscore);
            expect(mockHighScoreRepository.save).toHaveBeenCalledWith(expectedHighscore);
        });
    });

    describe("onHighscoreUpdated callback", () => {
        test("the callback is fired when highscore is updated", async() => {
            const datetime = new Date();
            const storedHighscore = [
                {rank:1, score:{value: 100, datetime}},
                {rank:2, score:{value: 90, datetime}},
                {rank:3, score:{value: 80, datetime}},
            ];
            const mockHighScoreRepository: HighScoreRepository = {
                save: jest.fn().mockResolvedValue(undefined),
                load: jest.fn().mockResolvedValue(storedHighscore)
            };
            const onUpdated = jest.fn();
    
            const {result, waitForNextUpdate} = renderHook(() => useHighScore(mockHighScoreRepository));
    
            await waitForNextUpdate();

            act(() => result.current.setOnHighScoreUpdated(onUpdated));
            
            const score = {value: 101, datetime};
            act(() => result.current.newScore(score));

            const expectedHighscore = [
                {rank:1, score:{value: 101, datetime}},
                {rank:2, score:{value: 100, datetime}},
                {rank:3, score:{value: 90, datetime}},
                {rank:4, score:{value: 80, datetime}},
            ];

            expect(onUpdated).toBeCalledTimes(1);
            expect(onUpdated).toBeCalledWith(expectedHighscore, score);
        });

        test("you can specify the callback via argument of hook function", async() => {
            const datetime = new Date();
            const storedHighscore = [
                {rank:1, score:{value: 100, datetime}},
                {rank:2, score:{value: 90, datetime}},
                {rank:3, score:{value: 80, datetime}},
            ];
            const mockHighScoreRepository: HighScoreRepository = {
                save: jest.fn().mockResolvedValue(undefined),
                load: jest.fn().mockResolvedValue(storedHighscore)
            };
            const onUpdated = jest.fn();
    
            const {result, waitForNextUpdate} = renderHook(() => useHighScore(mockHighScoreRepository, onUpdated));
    
            await waitForNextUpdate();
            
            const score = {value: 101, datetime};
            act(() => result.current.newScore(score));

            const expectedHighscore = [
                {rank:1, score:{value: 101, datetime}},
                {rank:2, score:{value: 100, datetime}},
                {rank:3, score:{value: 90, datetime}},
                {rank:4, score:{value: 80, datetime}},
            ];

            expect(onUpdated).toBeCalledTimes(1);
            expect(onUpdated).toBeCalledWith(expectedHighscore, score);
        });
    })
});