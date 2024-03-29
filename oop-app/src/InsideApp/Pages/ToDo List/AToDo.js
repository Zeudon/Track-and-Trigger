import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class AToDo extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'Name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Date',
        dataIndex: 'Date',
        editable:true,
      },
      {
        title: 'Description',
        dataIndex: 'Description',
        editable:true,
      },
      {
        title:'User',
        dataIndex: 'User',
        editable:true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: [],
      count: 0,
      newData:[],
    };
  }
  componentDidMount(){
    axios.get('http://127.0.0.1:8000/api/todoitem/')
    .then(res=>{
      var arr=[];
      for(var i=0;i<res.data.length;i++)
      {
        arr.push({key:i+1,Name:res.data[i].name,Date:res.data[i].date,Description:res.data[i].description,User:res.data[i].user})
      }
      console.log(arr);
      this.setState({
        dataSource: arr
      })
    })
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      Name: `Click to Add To Do Item Name`,
      Date: '29-11-2020',
      Description: `Click to add Description`,
      User:7
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
    axios.post('http://127.0.0.1:8000/api/todoitem/',{newData})
    .then(res=>{
      console.log(res);
      console.log(res.data);
    })
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <div style={{marginLeft:250, marginRight:50}}>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        </div>
      </div>
    );
  }
}

export default AToDo