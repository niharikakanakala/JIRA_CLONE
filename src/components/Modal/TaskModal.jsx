import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Col, Row, message } from 'antd';
import { STATUS_COLUMNS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

const { TextArea } = Input;
const { Option } = Select;

const TaskModal = ({ visible, task, onClose, onSave, screenSize }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
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
    }
  }, [task, visible, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (!values.title?.trim()) {
        message.error('Please enter a task title');
        setLoading(false);
        return;
      }
      
      const taskData = {
        ...values,
        title: values.title.trim(),
        description: values.description?.trim() || '',
        assignee: values.assignee?.trim() || '',
        reporter: values.reporter?.trim() || '',
        id: task?.id || generateId(),
        updated: new Date().toISOString(),
        created: task?.created || new Date().toISOString()
      };
      
      onSave(taskData);
      setLoading(false);
    } catch (error) {
      console.error('Form validation failed:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Better responsive width
  const getModalWidth = () => {
    if (screenSize === 'mobile') return '95%';
    if (screenSize === 'tablet') return '85%';
    return 650;
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: screenSize === 'mobile' ? '16px' : '18px', fontWeight: '600' }}>
          {task ? 'Edit Task' : 'Create New Task'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={getModalWidth()}
      centered
      destroyOnHidden
      maskClosable={false}
      footer={[
        <Button 
          key="cancel" 
          onClick={handleCancel}
          size={screenSize === 'mobile' ? 'large' : 'middle'}
          style={{ minWidth: screenSize === 'mobile' ? '80px' : '60px' }}
        >
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
          size={screenSize === 'mobile' ? 'large' : 'middle'}
          style={{ minWidth: screenSize === 'mobile' ? '80px' : '60px' }}
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
        size={screenSize === 'mobile' ? 'large' : 'middle'}
      >
        <Form.Item
          name="title"
          label="Task Title"
          rules={[
            { required: true, message: 'Please enter a task title' },
            { min: 3, message: 'Title must be at least 3 characters' },
            { max: 100, message: 'Title cannot exceed 100 characters' }
          ]}
        >
          <Input 
            placeholder="Enter a descriptive task title" 
            maxLength={100}
            showCount={screenSize !== 'mobile'}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: 'Description cannot exceed 500 characters' }
          ]}
        >
          <TextArea
            placeholder="Enter task description (optional)"
            rows={screenSize === 'mobile' ? 2 : 3}
            maxLength={500}
            showCount={screenSize !== 'mobile'}
          />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select status" showSearch>
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
              rules={[{ required: true, message: 'Please select a priority' }]}
            >
              <Select placeholder="Select priority" showSearch>
                <Option value="low">🟢 Low</Option>
                <Option value="medium">🟡 Medium</Option>
                <Option value="high">🔴 High</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Task Type"
              rules={[{ required: true, message: 'Please select a task type' }]}
            >
              <Select placeholder="Select task type" showSearch>
                <Option value="story">📖 Story</Option>
                <Option value="bug">🐛 Bug</Option>
                <Option value="task">✅ Task</Option>
                <Option value="feature">⭐ Feature</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="assignee"
              label="Assignee"
              rules={[
                { max: 50, message: 'Assignee name cannot exceed 50 characters' }
              ]}
            >
              <Input 
                placeholder="Enter assignee name (optional)"
                maxLength={50}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="reporter"
          label="Reporter"
          rules={[
            { max: 50, message: 'Reporter name cannot exceed 50 characters' }
          ]}
        >
          <Input 
            placeholder="Enter reporter name (optional)"
            maxLength={50}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;