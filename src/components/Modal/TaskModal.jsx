import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Col, Row } from 'antd';
import { STATUS_COLUMNS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

const { TextArea } = Input;
const { Option } = Select;

const TaskModal = ({ visible, task, onClose, onSave, screenSize }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      form.setFieldsValue({ ...task });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: 'todo',
        priority: 'medium',
        type: 'task'
      });
    }
  }, [task, visible, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (!values.title?.trim()) {
        return;
      }
      
      const taskData = {
        ...values,
        id: task?.id || generateId(),
        updated: new Date().toISOString(),
        created: task?.created || new Date().toISOString()
      };
      
      onSave(taskData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={handleCancel}
      width={screenSize === 'mobile' ? '90%' : screenSize === 'tablet' ? '80%' : 600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          {task ? 'Update' : 'Create'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'todo',
          priority: 'medium',
          type: 'task'
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input 
            placeholder="Enter task title" 
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            placeholder="Enter task description"
            rows={3}
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select status">
                {STATUS_COLUMNS.map(col => (
                  <Option key={col.key} value={col.key}>
                    {col.title}
                  </Option>
                ))}
                <Option value="backlog">Backlog</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select type">
                <Option value="story">Story</Option>
                <Option value="bug">Bug</Option>
                <Option value="task">Task</Option>
                <Option value="feature">Feature</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="assignee"
              label="Assignee"
            >
              <Input 
                placeholder="Enter assignee name"
                maxLength={50}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="reporter"
          label="Reporter"
        >
          <Input 
            placeholder="Enter reporter name"
            maxLength={50}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;