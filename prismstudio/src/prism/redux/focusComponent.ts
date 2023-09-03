import { WritableDraft } from "immer/dist/internal";
import { PrismState } from "./prismSlice";
import { iterateChildComponents } from "./componentHelper";

/**
 * {@link arr}의 값 중 {@link componentId}의 자손이 포함되어 있으면 이를 제외한 값을 반환
 * 
 * @param state 
 * @param arr 확인 할 배열
 * @param componentId 해당 컴포넌트의 자손을 확인
 * @returns 제외된 나머지 값
 */
export const filterIfChildren = (state: WritableDraft<PrismState>, arr: string[], componentId: string): string[] => {
    let ret: string[] = [...arr];
    iterateChildComponents(state, [componentId], (__component) => {
        const id = __component.id;
        ret = ret.filter(v => v !== id);
    })
    return ret;
}