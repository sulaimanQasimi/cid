import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { InfoType, Info } from '@/types/info';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, TicketIcon, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface Props {
  infoType: InfoType & {
    infos: Info[];
  };
}

export default function ShowInfoType({ infoType }: Props) {
  return (
    <>
      <Head title={`Info Type: ${infoType.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">{infoType.name}</CardTitle>
                <div className="flex gap-2">
                  <Link href={route('info-types.index')}>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft size={16} />
                      <span>Back to List</span>
                    </Button>
                  </Link>
                  <Link href={route('info-types.edit', infoType.id)}>
                    <Button className="flex items-center gap-1">
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </Button>
                  </Link>
                </div>
              </div>
              {infoType.code && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {infoType.code}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">ID</span>
                    <span className="text-base">{infoType.id}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Created At</span>
                    <span className="text-base flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(infoType.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {infoType.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{infoType.description}</p>
                  </div>
                )}
              </div>

              {infoType.infos && infoType.infos.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Associated Info Records</h3>
                    <Link href={route('infos.index', { type_id: infoType.id })}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <TicketIcon size={16} />
                        <span>View All</span>
                      </Button>
                    </Link>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {infoType.infos.map((info) => (
                          <TableRow key={info.id}>
                            <TableCell className="font-medium">{info.id}</TableCell>
                            <TableCell>{info.name}</TableCell>
                            <TableCell>
                              {info.code ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {info.code}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {info.infoCategory?.name || <span className="text-gray-400">-</span>}
                            </TableCell>
                            <TableCell>
                              {new Date(info.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(infoType.updated_at).toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
