import type { Todo } from '../types/Todo';

export class TodoUtil{
    static filterTodoItems = (
        items: Todo[],
        keyword: string,
        showingDone: boolean
    ) => {
        return items?.filter((item) => {
           if(!showingDone && item.done){
            return false;
           }
           return item.text.includes(keyword);
        });
    };
}