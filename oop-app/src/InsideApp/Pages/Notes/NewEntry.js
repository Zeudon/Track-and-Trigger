import React from 'react';
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import { Link,Route,Switch,Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { render } from 'react-dom';
import {withRouter} from 'react-router-dom'

const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class NewEntry extends React.Component
{
  constructor(props)
  {
    super(props);
  }
   
   onFinish = (values) => {
    const data={
      title:values.title,
      description:values.entry,
      slug:'i-love-shaurya',
      d_date:values.date,
      user:15
    }
    axios.post('http://localhost:8000/api/diary/',data,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res=>{
    console.log(res);
    console.log(res.data);
  })
    console.log('Success:', data);
    this.props.history.push("/dashboard/notes")
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
render(){
  return (
      <div style={{flex:1, alignItems:"center", width:2000, alignContent:"center"}}>
      <div style={{width:500, alignSelf:"center", flex:1, marginLeft:450}}>
          <br></br>
          <br></br>
          <br></br>
    <Form
      {...layout}
      name="newentry"
      initialValues={{
        remember: true,
      }}
      onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}
      
    >
      <Form.Item
        label="Title"
        name="title"
        
        rules={[
          {
            required: true,
            message: 'Please enter the title!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[
          {
            required: true,
            message: 'Please enter the date!',
          },
        ]}
      >
        <Input placeholder="DD-MM-YYYY"/>
      </Form.Item>

      <Form.Item
        label="Entry"
        name="entry"
        rules={[
          {
            required: true,
            message: 'Please tell us how your day was!',
          },
        ]}
      >
        <TextArea
          placeholder="How was your day?"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  );
      }
};

export default withRouter(NewEntry);