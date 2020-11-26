import React from 'react'
import '../../Style.css'

import Layout from '../../Containers/Layout'
import FileList from '../../Containers/ListView'

class Files extends React.Component{
    render(){
        return(
            <div>
                <Layout>
                    <FileList/>
                </Layout>
            </div>
        )
    }
}

export default Files