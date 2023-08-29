import { Model, ModelStatic, Transaction } from "sequelize";

class BaseService<T extends Model> {
  private model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  static async GetById<T extends Model>(this: new () => BaseService<T>, id: string) {
    const service = new this();
    return await service.model.findByPk(id);
  }

  static async Save<T extends Model>(this: new () => BaseService<T>, campos: Record<string, any>, buildOptions?: any | null, chaveComposta?: any, transaction?: Transaction) {
    const service = new this();
    let entidade: any;
    if (chaveComposta)
      entidade = await service.model.findOne(chaveComposta);

    else
      entidade = await service.model.findByPk(campos.id);

    if (entidade) {
      await entidade.update(campos, { transaction });
    } else {
      if(campos instanceof service.model){
        await campos.save({ transaction });
      }
      else{
        entidade = service.model.build(campos as T["_creationAttributes"], buildOptions);
        await entidade.save({ transaction });
      }
    }
    return entidade;
  }

  static async ChildListSave<T extends Model>(list: any | null, idParent: number, keyParent: string, callback: (item: T) => Promise<T>) {
    const listInserts: T[] = [];
    if (Array.isArray(list)) {
      for (const item of list) {
        item[keyParent] = idParent;
        listInserts.push(await callback(item as T));
      }
    }

    return listInserts;
  }

  static async DeleteById<T extends Model>(this: new () => BaseService<T>, id: string, transaction?: Transaction) {
    const service = new this();
    const entityToDelete = await service.model.findByPk(id);
    
    if (entityToDelete) {
      await entityToDelete.destroy({ transaction });
      return true;
    }

    return false;
  }
}

export default BaseService;