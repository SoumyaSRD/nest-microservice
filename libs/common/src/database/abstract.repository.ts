import { NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractDocument } from './abstract.scema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    // protected abstract readonly logger: PinoLogger
    constructor(
        protected readonly model: Model<TDocument>,
        private logger: PinoLogger,
        name,
    ) {
        logger.setContext(name);
    }

    /* Observable Method */

    /**
     * The function creates a new document by omitting the '_id' field and saving it to the database.
     * @param document - The `create` method takes an object as a parameter, which is of type
     * `Omit<TDocument, '_id'>`. This means that the object should have all properties of type
     * `TDocument` except for the `_id` property.
     * @returns An Observable of type TDocument is being returned.
     */
    create(document: Omit<TDocument, '_id'>): Observable<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return from(
            createdDocument.save().then((document) => document.toJSON() as TDocument),
        );
    }

    /**
     * The `findOne` function retrieves a single document based on a filter query and handles error cases
     * by throwing a `NotFoundException`.
     * @param filterQuery - The `filterQuery` parameter in the `findOne` method is used to specify the
     * criteria for finding a document in the database. It is of type `FilterQuery<TDocument>`, where
     * `TDocument` represents the type of document being searched for. This parameter is used to filter
     * and locate a
     * @returns The `findOne` method returns an Observable that emits a single document of type
     * `TDocument` or `any`. The method first queries the database using the provided `filterQuery`, then
     * maps the result to handle cases where the document is not found. If the document is not found, it
     * throws a `NotFoundException`. If an error occurs during the query, it logs a warning and throws a
     * `NotFoundException
     */
    findOne<TDocument>(
        filterQuery: FilterQuery<TDocument>,
        includeKey = '',
    ): Observable<TDocument | any> {
        return from(
            (includeKey
                ? this.model.findOne(filterQuery).select(`+${includeKey}`)
                : this.model.findOne(filterQuery)
            ).lean<TDocument>(true),
        ).pipe(
            map((document) => {
                if (!document) {
                    throw new NotFoundException('Document was not found');
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error finding document:', error);
                return throwError(
                    () => new NotFoundException('Document was not found'),
                );
            }),
        );
    }

    /**
     * The `findOneAndUpdate` function in TypeScript finds and updates a document based on a filter query
     * and returns an observable of the updated document or throws a NotFoundException if the document
     * was not found.
     * @param filterQuery - The `filterQuery` parameter is used to specify the conditions that documents
     * must meet in order to be updated. It is typically an object that contains key-value pairs
     * representing the fields and values that the documents must have. For example, `{ _id: '12345' }`
     * would be a filter
     * @param update - The `update` parameter in the `findOneAndUpdate` method is used to specify the
     * modifications that should be applied to the document that matches the `filterQuery`. It can
     * include various update operators like ``, ``, ``, etc., depending on the desired
     * changes to be made to the
     * @returns The `findOneAndUpdate` method returns an Observable that emits either the updated
     * document of type `TDocument` or any other type. The method first tries to find and update a
     * document in the database based on the provided filter query and update query. If the document is
     * found and updated successfully, the updated document is emitted by the Observable. If the document
     * is not found, a `NotFoundException` is thrown
     */
    findOneAndUpdate<TDocument>(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument | any>,
    ): Observable<TDocument | any> {
        return from(
            this.model
                .findOneAndUpdate(filterQuery, update, {
                    new: true,
                })
                .lean<TDocument>(true),
        ).pipe(
            map((document) => {
                if (!document) {
                    throw new NotFoundException('Document was not found');
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error updating document:', error);
                return throwError(
                    () => new NotFoundException('Document was not found'),
                );
            }),
        );
    }

    /**
     * The `find` function retrieves documents based on a filter query and handles errors by throwing a
     * NotFoundException if no documents are found.
     * @param filterQuery - The `filterQuery` parameter is a query object that specifies the conditions
     * that documents must meet in order to be included in the result set when querying a database. It is
     * used to filter the documents based on certain criteria such as matching specific fields, ranges,
     * or other conditions.
     * @returns The `find` method returns an Observable that emits an array of `TDocument` objects or
     * `any`. The method first queries the database using the provided `filterQuery`, then maps the
     * result to handle cases where no documents are found. If no documents are found, a
     * `NotFoundException` is thrown. If an error occurs during the query, it is caught and logged, and a
     * `NotFoundException`
     */
    find<TDocument>(
        filterQuery: FilterQuery<TDocument>,
    ): Observable<TDocument[] | any> {
        return from(this.model.find(filterQuery).lean<TDocument[]>(true)).pipe(
            map((documents: TDocument[] | any) => {
                if (!documents.length) {
                    throw new NotFoundException('Document was not found');
                }
                return documents;
            }),
            catchError((error) => {
                this.logger.warn('Error finding documents:', error);
                return throwError(
                    () => new NotFoundException('Document was not found'),
                );
            }),
        );
    }

    /**
     * The function `findOneAndDelete` finds and deletes a document based on a filter query in a
     * TypeScript application, handling errors and returning an observable.
     * @param filterQuery - The `filterQuery` parameter is used to specify the criteria for selecting a
     * document to delete. It is a query object that defines the conditions that must be met for a
     * document to be deleted. This query is used to find and delete a single document that matches the
     * specified criteria.
     * @returns The `findOneAndDelete` method returns an Observable that emits either the deleted
     * document of type `TDocument` or an error if the document was not found.
     */
    findOneAndDelete<TDocument>(
        filterQuery: FilterQuery<TDocument>,
    ): Observable<TDocument | any> {
        return from(
            this.model.findOneAndDelete(filterQuery).lean<TDocument>(true),
        ).pipe(
            map((document) => {
                if (!document) {
                    throwError(() => new NotFoundException('Document was not found'));
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error deleting document:', error);
                return throwError(
                    () => new NotFoundException('Document was not found'),
                );
            }),
        );
    }

    /**
     * The function `findAllWithFiltersAndPagination` retrieves data based on filters and pagination parameters, including case sensitivity and lookups, and returns the result with data and total count.
     * @param filterQuery - The `filterQuery` parameter is an object that contains the filtering criteria for the data you want to retrieve. It typically includes key-value pairs where the key represents the field to filter on and the value represents the filter value.
     * @param [page=1] - The `page` parameter in the `findAllWithFiltersAndPagination` function is used to specify the page number of results to retrieve. It determines which page of results to return based on the specified limit of items per page.
     * @param [limit=10] - The `limit` parameter in the `findAllWithFiltersAndPagination` function specifies the maximum number of documents that should be returned per page. By default, it is set to 10, meaning that the function will return up to 10 documents per page unless specified otherwise.
     * @param caseSensitiveData - The `caseSensitiveData` parameter in the `findAllWithFiltersAndPagination` function is an object that allows you to specify which fields in the filter query should be treated as case-sensitive during the search operation.
     * @param lookups - The `lookups` parameter in the `findAllWithFiltersAndPagination` function is an array that contains objects specifying the details of any additional data lookups that need to be performed during the aggregation pipeline.
     * @returns The `findAllWithFiltersAndPagination` function returns an Observable that emits an object with two properties:
     * 1. `data`: An array of filtered and paginated documents from the database. Each document in the array has sensitive data like the password removed.
     * 2. `total`: The total count of documents that match the filter criteria.
     */
    findAllWithFiltersAndPagination(
        filterQuery: FilterQuery<TDocument>,
        page = 1,
        limit = 10,
        caseSensitiveData = {},
        lookups = [],
    ): Observable<any> {
        const skip = (page - 1) * limit;

        const query = Object.keys(filterQuery).reduce((acc, param) => {
            acc[param] = caseSensitiveData[param]
                ? { $eq: filterQuery[param] }
                : { $regex: filterQuery[param], $options: 'i' }; // i is used for case insensitive
            return acc;
        }, {});

        const pipeline: any = [
            { $match: query },
            ...lookups.map((lookup) => ({
                $lookup: {
                    from: lookup.from,
                    localField: lookup.localField,
                    foreignField: Array.isArray(lookup.foreignField)
                        ? { $in: lookup.foreignField }
                        : lookup.foreignField,
                    as: lookup.as,
                    pipeline: lookup.pipeline || [], // Nested pipeline for child lookups
                },
            })),
            {
                $facet: {
                    data: [
                        { $sort: { updatedAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ];

        return from(this.model.aggregate(pipeline)).pipe(
            map(([result]) => ({
                data: result.data.map((item) => {
                    const { password, ...rest } = item;
                    return rest;
                }),
                total: result.totalCount[0]?.count || 0,
            })),
        );
    }
}

/* Async Await Method */
/* async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.readonlymodel({
            ...document, _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument
    } 
    
    findOne(filterQuery: FilterQuery<TDocument>): Observable<TDocument> {
           const document = new this.readonlymodel({
               ...document,
               _id: new Types.ObjectId(),
           });
   
           return from(createdDocument.save()).pipe(
               map((savedDocument) => savedDocument.toJSON() as unknown as TDocument)
           );
       } 
       
    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }
 
    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            new: true
        }).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }
 
    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        const document = await this.model.find(filterQuery).lean<TDocument[]>(true)
        if (document.length) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }
 
    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }
 */
