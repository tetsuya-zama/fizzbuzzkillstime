import {useState, useEffect} from 'react';

import {FuncObjOf, funcObjSetterOf} from './funcutil';

export type FizzBuzzAnswer = 'Fizz' | 'Buzz' | 'FizzBuzz';
export type Answer = number | FizzBuzzAnswer;
export type onCorrectCallback = (currentNumber: number, currentAnswer: Answer) => void;
export type onGameOverCallback = (score: number) => void; 


export function useFizzBuzz(params?:{onCorrectFunc?: onCorrectCallback, onGameOverFunc?: onGameOverCallback}){
    const [currentNum, setCurrentNum] = useState<number>(0);
    const [currentAnswer, setCurrentAnswer] = useState<Answer>(0);
    const [nextAnswer, setNextAnswer] = useState<Answer>(1);
    const [onCorrect, setOnCorrect] = useState<FuncObjOf<onCorrectCallback>>({fn: params?.onCorrectFunc});
    const [onGameOver, setOnGameOver] = useState<FuncObjOf<onGameOverCallback>>({fn: params?.onGameOverFunc});

    const answerOf: (n : number) => Answer = (n: number) => 
        n === 0 ? 0
        : n % 15 === 0 ? 'FizzBuzz' 
        : n % 5 === 0 ? 'Buzz' 
        : n % 3 === 0 ? 'Fizz' 
        : n;
    
    useEffect(()=>{
        setCurrentAnswer(answerOf(currentNum));
        setNextAnswer(answerOf(currentNum + 1));
    }, [currentNum]);

    const countUp: () => void = () => setCurrentNum(currentNum + 1);

    const clearCount: () => void = () => setCurrentNum(0);

    const answer: (ans: Answer) => void = (ans: Answer) => {
        if(ans === nextAnswer){
            if(onCorrect.fn) onCorrect.fn(currentNum + 1, answerOf(currentNum + 1));
            countUp();
        }else{
            if(onGameOver.fn) onGameOver.fn(currentNum);
            clearCount();
        }
    };

    return {
        currentNum,
        currentAnswer,
        setOnCorrect:funcObjSetterOf(setOnCorrect),
        setOnGameOver:funcObjSetterOf(setOnGameOver),
        answer
    };
}