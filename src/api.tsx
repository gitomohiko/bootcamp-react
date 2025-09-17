/** 個々のToDoを表す型。*/
export type TodoItem = {
  /** 全てのToDoで一意な値 */
  id: number;
  /** ToDoの内容 */
  text: string;
  /** 完了すると`true`となる。 */
  done: boolean;
};

/**
 * ブラウザ上で動作するAPIクライアントのモック(=それらしく動くもの)。
 * 今回はあまり内部の処理について理解する必要はなく、ToDoの配列を保持して
 * それを操作するためのメソッドを提供している、という程度の理解で十分。
 *
 * ネットワーク越しのリクエストを再現するため、各メソッドには遅延時間を設けている。
 */
export class TodoApiMock {
  constructor(private todoItems: TodoItem[]) {}

  /** 条件に該当するToDoを配列で返す。 */
  async queryItems(keyword: string, includeDone: boolean) {
    await this.simulateNetworkDelay();
    return this.todoItems.filter((item) => {
      if (!includeDone && item.done) return false;
      return keyword ? item.text.includes(keyword) : true;
    });
  }

  /** 新しくToDoを作成する。 */
  async createItem(text: string) {
    await this.simulateNetworkDelay();
    const newItem = { id: this.generateId(), text, done: false };
    this.todoItems.push(newItem);
    return newItem;
  }

  /** 既存のToDoを置き換える。 */
  async updateItem(newItem: TodoItem) {
    await this.simulateNetworkDelay();
    this.todoItems = this.todoItems.map((item) =>
      item.id === newItem.id ? newItem : item,
    );
  }

  /** 既存のToDoを削除する。 */
  async deleteItem(id: number) {
    await this.simulateNetworkDelay();
    this.todoItems = this.todoItems.filter((item) => item.id !== id);
  }

  private simulateNetworkDelay() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  /** ID用途に重複しなさそうな数値を適当に生成する。 */
  private generateId() {
    // モックなので適当に1970-01-01からの経過ミリ秒を利用した
    return Date.now();
  }
}

/**
 * APIサーバに対してリクエストを行う実際のAPIクライアント。
 * REST風のAPIを想定している。
 *
 * ここではブラウザ標準の`fetch`を利用しているが、[Axios](https://www.npmjs.com/package/axios)
 * というライブラリを使うとこれよりも楽に書け、特にJSONの扱いが便利になる。
 */
export class TodoApiClient {
  /**
   * @example
   * new TodoApiClient('http://localhost:8080')
   */
  constructor(private baseUrl: string) {}

  /** 条件に該当するToDoを配列で返す。 */
  async queryItems(keyword: string, includeDone: boolean) {
    const url = new URL(`${this.baseUrl}/todo`);
    if (keyword !== "") {
      url.searchParams.set("keyword", keyword);
    }
    if (includeDone) {
      url.searchParams.set("include_done", "true");
    }
    return fetch(url).then((res) => res.json());
  }

  /** 新しくToDoを作成する。 */
  async createItem(text: string) {
    return fetch(`${this.baseUrl}/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((res) => res.json());
  }

  /** 既存のToDoを置き換える。 */
  async updateItem(newItem: TodoItem) {
    return fetch(`${this.baseUrl}/todo/${newItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).then((res) => res.json());
  }

  /** 既存のToDoを削除する。 */
  async deleteItem(id: number) {
    return fetch(`${this.baseUrl}/todo/${id}`, { method: "DELETE" }).then(
      (res) => res.json(),
    );
  }
}