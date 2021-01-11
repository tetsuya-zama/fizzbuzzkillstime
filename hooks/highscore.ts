import {useState, useEffect} from 'react';
import { FuncObjOf, funcObjSetterOf } from './funcutil';

export interface Score{
    value: number,
    datetime: Date
};

export type HighScore = Array<{rank: number, score: Score}>

export interface HighScoreRepository{
    save: (highscore: HighScore) => Promise<void>
    load: () => Promise<HighScore>
}

export type onHighScoreUpdatedCallback = (highscore: HighScore, newScore: Score) => void;

export const isNewHighScoreOf = (highscore: HighScore) => 
    (score: Score) => highscore.length < 10 || score.value >= Math.min(...highscore.map(row => row.score.value));

export const newScoreOf = (
    highscore: HighScore, 
    setHighscore: (val: HighScore) => void, 
    onHighScoreUpdated: FuncObjOf<onHighScoreUpdatedCallback>) =>
    (score: Score) => {
        if(isNewHighScoreOf(highscore)(score)){
            const newScores = [score , ...highscore.map(row => row.score)].sort((a,b) => b.value - a.value);
            const newHighScore: HighScore = newScores.reduce<HighScore>((acc, score, idx) => {
                if(idx < 10){
                    return [...acc, {rank: idx +1, score}];
                }else{
                    return acc;
                }
            }, []);

            setHighscore(newHighScore);

            if(onHighScoreUpdated.fn) onHighScoreUpdated.fn(newHighScore, score);
        }
    }

export function useHighScore(repository: HighScoreRepository, onHighScoreUpdatedFn?: onHighScoreUpdatedCallback){
    const [highscore, setHighscore] = useState<HighScore>([]);
    const [onHighScoreUpdated, setOnHighScoreUpdated] = useState<FuncObjOf<onHighScoreUpdatedCallback>>({fn:onHighScoreUpdatedFn});

    useEffect(() => {
        repository.load().then(loaded => setHighscore(loaded));
    },[]);

    useEffect(()=>{
        if(highscore.length > 0) repository.save(highscore);
    }, [highscore]);

    const newScore = newScoreOf(highscore, setHighscore, onHighScoreUpdated);

    return {
        highscore,
        newScore,
        setOnHighScoreUpdated:funcObjSetterOf(setOnHighScoreUpdated)
    }
}