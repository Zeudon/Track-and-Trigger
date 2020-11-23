import React from 'react';
import 'antd/dist/antd.css';

import Layout from '../../Containers/Layout'
import ItemLists from '../../Containers/ListView'

class Files extends React.Component{
    render(){
        return(
            <div>
                <Layout>
                    <ItemLists/>
                </Layout>
            </div>
        )
    }
}

export default Files