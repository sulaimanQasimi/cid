import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button, Form, Input, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AppLayout from '@/layouts/AppLayout';

interface Props extends PageProps {}

const DepartmentCreate: React.FC<Props> = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
  });

  const handleSubmit = () => {
    post(route('departments.store'));
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <AppLayout>
      <Head title="Create Department" />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href={route('departments.index')}>
            <Button icon={<ArrowLeftOutlined />}>Back to Departments</Button>
          </Link>
        </div>
        <Card title="Create New Department">
          <Form
            {...formItemLayout}
            layout="horizontal"
            onFinish={handleSubmit}
            initialValues={data}
          >
            <Form.Item
              label="Name"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
              required
            >
              <Input
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Enter department name"
              />
            </Form.Item>

            <Form.Item
              label="Code"
              validateStatus={errors.code ? 'error' : ''}
              help={errors.code}
              required
            >
              <Input
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
                placeholder="Enter department code"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit" loading={processing}>
                Create Department
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DepartmentCreate;
