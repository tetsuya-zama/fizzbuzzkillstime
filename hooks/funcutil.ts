export type FuncObjOf<T> = {fn?: T};
export function funcObjSetterOf<T>(setter:(funcObj:FuncObjOf<T>) => void){
    return (val: T | FuncObjOf<T>) => {
        if("fn" in val){
            setter(val);
        }else{
            setter({fn:val as T})
        }
    }
}