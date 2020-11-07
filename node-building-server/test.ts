class A {
  static tableName?: string;
  static getTableName() {
    console.log(this.name);
    return this.tableName;
  }
}

class B extends A {
  static tableName = 'abcd';
  static getTableName() {
    console.log(`new ${this.name}`);
    return this.tableName;
  }
}

const b = new B();

console.log(A.getTableName());
console.log((b.constructor as any).getTableName());
