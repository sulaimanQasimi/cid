import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button, Card, Table, Descriptions, Space, Badge } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import AppLayout from '@/layouts/AppLayout';

interface Info {
  id: number;
  name: string;
  code: string;
  description: string;
  info_type: {
    id: number;
    name: string;
  };
  info_category: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
  infos: Info[];
}

interface Props extends PageProps {
  department: Department;
}

const DepartmentShow: React.FC<Props> = ({ department }) => {
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
      title: 'Type',
      key: 'info_type',
      render: (_, record: Info) => record.info_type.name,
    },
    {
      title: 'Category',
      key: 'info_category',
      render: (_, record: Info) => record.info_category.name,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Info) => (
        <Space size="middle">
          <Link href={route('infos.show', record.id)}>
            <Button type="primary" size="small">
              View
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={`Department: ${department.name}`} />
      <div className="container mx-auto py-6">
        <div className="mb-6 flex justify-between">
          <Link href={route('departments.index')}>
            <Button icon={<ArrowLeftOutlined />}>Back to Departments</Button>
          </Link>
          <Link href={route('departments.edit', department.id)}>
            <Button icon={<EditOutlined />} type="primary">
              Edit Department
            </Button>
          </Link>
        </div>

        <Card title="Department Details" className="mb-6">
          <Descriptions bordered>
            <Descriptions.Item label="Name" span={3}>{department.name}</Descriptions.Item>
            <Descriptions.Item label="Code" span={3}>{department.code}</Descriptions.Item>
            <Descriptions.Item label="Created At" span={3}>
              {new Date(department.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At" span={3}>
              {new Date(department.updated_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Total Infos" span={3}>
              <Badge count={department.infos.length} showZero />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Associated Information" className="mb-6">
          <Table
            columns={columns}
            dataSource={department.infos}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default DepartmentShow;
