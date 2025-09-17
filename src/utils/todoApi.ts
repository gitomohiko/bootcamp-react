import { supabaseClient  } from "../lib/supabaseClient";;
import type { Todo } from '../types/Todo.ts';

const supabase = supabaseClient;

export class TodoApi {
    async queryItems(keyword: string, includeDone: boolean): Promise<Todo[]>{
        const { data, error } = await supabase
            .from('todos')
            .select('id, text, done')
            .like('text','%'+keyword+'%')
            .eq('done', includeDone)
            .order('id', { ascending: false })

        if (error) throw error;
        return data as Todo[];
    }

    async readTimes(): Promise<Todo[]>{
        const { data, error } = await supabase
            .from('todos')
            .select('id, text, done')
            .order('id', { ascending: false })

        if (error) throw error;
        return data as Todo[];
    }

    async createItem(item: Omit<Todo, 'id'>) {
        console.log('createItem start');
        const { error } = await supabase.from('todos').insert(item);
        if (error) throw error;
        console.log('createItem end');
    }

    async updateItem(item: Todo) {
        const { error } = await supabase
            .from('todos')
            .update(item)
            .eq('id', item.id);
        if (error) throw error;
    }

    async deleteItem(id: number) {
        const { error } = await supabase.from('todos').delete().eq('id', id);
        if(error) throw error;
    }
}