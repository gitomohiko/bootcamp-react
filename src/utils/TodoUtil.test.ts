import { describe, expect, test } from 'vitest';
import { TodoUtil } from './TodoUtil';


const todoItems = [
    {id: 1, text: '昼寝', done: false},
    {id: 2, text: '二度寝', done: true},
    {id: 3, text: '暇つぶし', done: false},
    {id: 4, text: 'ボーっとする', done: false}
]

describe('filterTodoItems', () => {
    test('全件表示', () => {
        const result = TodoUtil.filterTodoItems(todoItems, '', true);
        expect(result).toEqual([
            {id: 1, text: '昼寝', done: false},
            {id: 2, text: '二度寝', done: true},
            {id: 3, text: '暇つぶし', done: false},
            {id: 4, text: 'ボーっとする', done: false}
        ]);
    });

    test('キーワード検索', () => {
        const result = TodoUtil.filterTodoItems(todoItems, '寝', true);
        expect(result).toEqual([
            {id: 1, text: '昼寝', done: false},
            {id: 2, text: '二度寝', done: true}
        ]);
    });
    
    test('キーワード検索一致なし', () => {
        const result = TodoUtil.filterTodoItems(todoItems, '日経平均株価', true);
        expect(result).toEqual([]);
    });
    
    test('完了したもの非表示', () => {
        const result = TodoUtil.filterTodoItems(todoItems, '', false);
        expect(result).toEqual([
            {id: 1, text: '昼寝', done: false},
            {id: 3, text: '暇つぶし', done: false},
            {id: 4, text: 'ボーっとする', done: false}
        ]);
    });
});