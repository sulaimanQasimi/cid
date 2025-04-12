import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button, Table, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import AppLayout from '@/layouts/AppLayout';

interface Department {
  id: number;
  name: string;
  code: string;
  infos_count: number;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  departments: {
    data: Department[];
    links: any[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

const DepartmentIndex: React.FC<Props> = ({ departments, flash }) => {
  const handleDelete = (id: number) => {
    router.delete(route('departments.destroy', id), {
      onSuccess: () => {
        message.success('Department deleted successfully');
      }
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Info Count',
      dataIndex: 'infos_count',
      key: 'infos_count',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Department) => (
        <Space size="middle">
          <Link href={route('departments.show', record.id)}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              View
            </Button>
          </Link>
          <Link href={route('departments.edit', record.id)}>
            <Button type="default" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this department?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title="Departments" />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Departments</h1>
          <Link href={route('departments.create')}>
            <Button type="primary" icon={<PlusOutlined />}>
              Create Department
            </Button>
          </Link>
        </div>

        {flash.message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {flash.message}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={departments.data}
          rowKey="id"
          pagination={{
            total: departments.total,
            pageSize: departments.per_page,
            current: departments.current_page,
            onChange: (page) => {
              router.get(route('departments.index', { page }));
            },
          }}
        />
      </div>
    </AppLayout>
  );
};

export default DepartmentIndex;
