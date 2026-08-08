import {Avatar, Button, Checkbox, Chip, Table} from "@heroui/react";

import React, { useEffect, useState } from "react";
import {Icon} from "@iconify/react";
import { useGetAllProductsQuery } from "../../services/productApi";
import { Pagination } from "@heroui/react";
export default function ProductTableComponent() {
  const [page, setPage] = useState(1);

  
  const {data:products} = useGetAllProductsQuery(
    {page : page}
  );
  console.log(`===> fetch product`, products?.content);
  const totalPages = products?.totalPages ?? 1;

  return (
    <div>
      <Table className="p-8">
        <Table.ScrollContainer>
            <Table.Content aria-label="Team members" className="min-w-[800px]">
              <Table.Header>
                <Table.Column isRowHeader>Product UUID</Table.Column>
                <Table.Column>Image</Table.Column>
                <Table.Column>Product Name</Table.Column>
                <Table.Column>Quantity</Table.Column>
                <Table.Column>Price</Table.Column>
                <Table.Column>Category</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {
                   products?.content?.map(u => (
                    <Table.Row key={u?.uuid} >
                      <Table.Cell>{u?.uuid}</Table.Cell>
                    <Table.Cell>
                      <img src={u?.thumbnail} alt="" className="w-12 h-12" />
                    </Table.Cell>
                    <Table.Cell>{u?.name}</Table.Cell>
                    <Table.Cell>{u?.stockQuantity}</Table.Cell>
                    <Table.Cell>{u?.priceOut}</Table.Cell>
                    <Table.Cell>{u?.category?.name}</Table.Cell>
                     <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:eye" />
                    </Button>
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:pencil" />
                    </Button>
                    <Button isIconOnly size="sm" variant="danger-soft">
                      <Icon className="size-4" icon="gravity-ui:trash-bin" />
                    </Button>
                  </div>
                </Table.Cell>
                  </Table.Row>
                   ))
                }
              </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
      </Table>
       {/* pagination — kept OUTSIDE <Table>, whose root has overflow:clip and was
          hiding all but the last page button */}
        <Pagination className="justify-center">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous onClick={() => setPage((p) => p <= 0 ? 0 : p - 1)}>
            <Pagination.PreviousIcon />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
              {p}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next  onClick={() => setPage((p) => p + 1)}>
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
    </div>
  );
}
