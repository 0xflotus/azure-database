import { AzureTableStorageRepository } from './azure-table.repository';
import { EntityPartitionKey, EntityRowKey, EntityInt32 } from './azure-table.decorators';
import { Repository } from './azure-table.interface';

import azure = require('azure-storage');

// Mocking
jest.mock('./azure-table.mapper');
const MockedAzureTableStorageService = require('./azure-table.service');
jest.mock('./azure-table.service', () => {
  class AzureEntityMapper {
    static createEntity<T>(entity: T) {
      return {
        ...entity,
        ...MockedEntity,
      };
    }
    static serialize<E>(entryDescriptor: azure.TableService.EntityMetadata & E) {
      return MockedDTO;
    }
    static serializeAll<T>(entriesDescriptor: azure.TableService.EntityMetadata[]): any[] {
      return entriesDescriptor.map(AzureEntityMapper.serialize);
    }
  }
  return class AzureTableStorageService {
    entries = [];
    queryEntities() {
      return Promise.resolve({
        entries: this.entries,
      });
    }
    insertEntity<T>(table: string, entity: T): Promise<azure.TableService.EntityMetadata> {
      entity = AzureEntityMapper.createEntity(entity);
      this.entries.push(entity);
      return Promise.resolve({
        ...entity,
        '.metadata': null,
      });
    }
  };
});

const MockedDTO = {
  id: 132,
};
const MockedEntity = {
  id: {
    $: 'Edm.Int32',
    _: MockedDTO.id,
  },
  PartitionKey: {
    $: 'Edm.String',
    _: 'PartitionKeyMock',
  },
  RowKey: {
    $: 'Edm.String',
    _: '94189dd7-6951-4b6f-9b46-3f11afc60bc2',
  },
  Timestamp: '2019-09-13T04:53:51.144Z',
};
const TABLE_NAME = 'fakeTable';
let repository: Repository<typeof MockedEntity>;

///////
// Tests
///////

fdescribe('AzureTableStorageRepository', () => {
  beforeEach(() => {
    const manager = new MockedAzureTableStorageService();
    repository = new AzureTableStorageRepository<typeof MockedEntity>(manager, TABLE_NAME);
  });
  it('Get a valid Repository instance', () => {
    expect(repository).toBeTruthy();
  });
  it('findAll(): should return empty list when DB is empty', async () => {
    const { entries } = await repository.findAll();
    console.log(entries);

    expect(entries.length).toBe(0);
  });
  it('create(): should create an entity', async () => {
    const createdEntity = await repository.create(MockedEntity);

    expect(createdEntity.id).toStrictEqual(132);
    // tslint:disable-next-line: no-string-literal
    expect(createdEntity['PartitionKey']).toStrictEqual('PartitionKeyMock');
    // tslint:disable-next-line: no-string-literal
    expect(createdEntity['RowKey']).toStrictEqual('94189dd7-6951-4b6f-9b46-3f11afc60bc2');
    expect(createdEntity.id).toStrictEqual(132);
  });
  it('findAll(): should return all entities when DB contains entities', async () => {
    await repository.create(MockedEntity);
    await repository.create(MockedEntity);
    await repository.create(MockedEntity);

    const { entries } = await repository.findAll();
    expect(entries.length).toBe(3);
  });

  it('should return 1 entity', async () => {
    const createdEntity = await repository.create(MockedEntity);
    console.log(createdEntity);

    // await repository.delete(
    //   new Entity({
    //     id: 132,
    //   }),
    // );
    expect((await repository.findAll()).entries.length).toBe(1);
  });
});
