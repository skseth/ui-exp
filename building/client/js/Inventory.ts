export class Inventory {
  #list: string[]
  #unitsLookup: { [key: string]: string } = {}

  constructor(items: model.InventoryItem[]) {
    this.#list = items.map((item) => item.name).sort()
    items.forEach((item) => (this.#unitsLookup[item.name] = item.unit))
  }

  unit(itemname: string): string {
    return this.#unitsLookup[itemname] || 'units'
  }

  get list(): string[] {
    return this.#list
  }

  static initialize(): Promise<Inventory> {
    return new Promise<Inventory>((resolve, reject) => {
      google.script.run
        .withSuccessHandler((items) => {
          resolve(new Inventory(items as model.InventoryItem[]))
        })
        .withFailureHandler((error) => {
          console.log(`Error in inventory initialization ${error}`)
          reject(error)
        })
        .inventoryList()
    })
  }
}
