import { renderHook, act} from '@testing-library/react-hooks';
import { useFizzBuzz, Answer } from './fizzbuzz';

describe("useFizzBuzz hook",() => {
    test("Both currentNum and currentAnswer is 0 when the hook is rendered",() => {
        const {result} = renderHook(() => useFizzBuzz());

        expect(result.current.currentNum).toBe(0);
        expect(result.current.currentAnswer).toBe(0);
        
    });

    test("The count will be up when correct answer is given",() => {
        const {result} = renderHook(() => useFizzBuzz());

        act(() => result.current.answer(1));

        expect(result.current.currentNum).toBe(1);
        expect(result.current.currentAnswer).toBe(1);
    });

    test("The answer will be 'Fizz' if the next num is multiple of 3", () => {
        const {result} = renderHook(() => useFizzBuzz());

        [...Array(2).keys()]
            .map(n => n + 1)
            .forEach(n => act(() => result.current.answer(n)));

        act(() => result.current.answer('Fizz'));

        expect(result.current.currentNum).toBe(3);
        expect(result.current.currentAnswer).toBe('Fizz');
    });

    test("The answer will be 'Buzz' if the next num is multiple of 5", () => {
        const {result} = renderHook(() => useFizzBuzz());

        [...Array(4).keys()].map(n => n + 1)
            .map(n => n % 3 === 0 ? 'Fizz' : n)
            .forEach(n => act(() => result.current.answer(n)));

        act(() => result.current.answer('Buzz'));

        expect(result.current.currentNum).toBe(5);
        expect(result.current.currentAnswer).toBe('Buzz');
    });

    test("The answer will be 'FizzBuzz' if the next num is multiple of 15", () => {
        const {result} = renderHook(() => useFizzBuzz());

        [...Array(14).keys()].map(n => n + 1)
            .map(n => n % 5 === 0 ? 'Buzz' : n % 3 === 0 ? 'Fizz' : n)
            .forEach(n => act(() => result.current.answer(n)));

        act(() => result.current.answer('FizzBuzz'));

        expect(result.current.currentNum).toBe(15);
        expect(result.current.currentAnswer).toBe('FizzBuzz');
    });

    test("The count returns to 0 if wrong answer is given", () => {
        const {result} = renderHook(() => useFizzBuzz());

        [...Array(14).keys()].map(n => n + 1)
            .map(n => n % 5 === 0 ? 'Buzz' : n % 3 === 0 ? 'Fizz' : n)
            .forEach(n => act(() => result.current.answer(n)));

        act(() => result.current.answer(15)); // should be 'FizzBuzz'!!

        expect(result.current.currentNum).toBe(0);
        expect(result.current.currentAnswer).toBe(0);
    });

    test("The onCorrect function will be called when correct answer is given", () => {
        const {result} = renderHook(() => useFizzBuzz());

        const onCorrect = jest.fn();
        act(() => result.current.setOnCorrect({fn:onCorrect}));

        act(() => result.current.answer(1));

        expect(onCorrect).toHaveBeenCalledWith(1,1);
    });

    test("The onGameOver function will be called when wrong answer is given", () => {
        const {result} = renderHook(() => useFizzBuzz());

        const onGameOver = jest.fn();
        act(() => result.current.setOnGameOver(onGameOver));

        act(() => result.current.answer('Fizz'));

        expect(onGameOver).toHaveBeenCalledWith(0);
    });

    test("Callbacks also will be specified by initial params",() => {
        const onCorrect = jest.fn();
        const onGameOver = jest.fn();

        const {result} = renderHook(() => useFizzBuzz({onCorrectFunc: onCorrect, onGameOverFunc: onGameOver}));

        [...Array(14).keys()].map(n => n + 1)
            .map(n => n % 5 === 0 ? 'Buzz' : n % 3 === 0 ? 'Fizz' : n)
            .forEach(n => act(() => result.current.answer(n)));

        act(() => result.current.answer(15)); // should be 'FizzBuzz'!!

        expect(onCorrect).toBeCalledTimes(14);
        expect(onGameOver).toHaveBeenCalledTimes(1);
    });
})