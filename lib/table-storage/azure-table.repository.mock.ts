import { Repository } from './azure-table.interface';
import * as azure from 'azure-storage';

export class AzureTableStorageRepositoryMock<T> implements Repository<T> {
  private entries = [];

  select(...args: any[]): Repository<T> & azure.services.table.TableQuery {
    throw new Error('Method not implemented.');
  }
  top(top: number): Repository<T> & azure.services.table.TableQuery {
    throw new Error('Method not implemented.');
  }
  where(condition: string, ...args: any[]): Repository<T> & azure.services.table.TableQuery {
    throw new Error('Method not implemented.');
  }
  and(condition: string, ...args: any[]): Repository<T> & azure.services.table.TableQuery {
    throw new Error('Method not implemented.');
  }
  or(condition: string, ...args: any[]): Repository<T> & azure.services.table.TableQuery {
    throw new Error('Method not implemented.');
  }
  toQueryObject(): Object {
    throw new Error('Method not implemented.');
  }
  findAll(
    tableQuery?: import('azure-storage').services.table.TableQuery,
    currentToken?: import('./azure-table.interface').AzureTableContinuationToken,
  ): Promise<import('./azure-table.interface').AzureTableStorageResultList<T>> {
    throw new Error('Method not implemented.');
  }
  find(rowKey: string, entity: Partial<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  create(entity: T): Promise<T & azure.services.table.TableService.EntityMetadata> {
    throw new Error('Method not implemented.');
  }
  update(rowKey: string, entity: Partial<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  delete(rowKey: string, entity: T): Promise<import('./azure-table.interface').AzureTableStorageResponse> {
    throw new Error('Method not implemented.');
  }
}
