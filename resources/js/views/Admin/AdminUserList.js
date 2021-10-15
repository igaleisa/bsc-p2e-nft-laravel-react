import React, { useEffect, } from "react";
import { useHistory } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';

import { GetUserListService, } from '@/services/UserServices';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";
import CardIcon from "@/components/Card/CardIcon.js";
import CardHeader from "@/components/Card/CardHeader.js";
import ReactTable from "@/components/ReactTable/ReactTable.js";

import MessageBox from "@/components/MessageBox/MessageBox.js";

import { dataTable } from "@/variables/general.js";

import { cardTitle } from "@/assets/jss/material-dashboard-pro-react.js";

import { LogoutAction } from '@/redux/actions/AuthActions';


const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const useStyles = makeStyles(styles);

export default function UserList() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory(); 

  const [data, setData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);  
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalContent, setModalContent] = React.useState('');

  useEffect(() => {
    GetUserListService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
          setData(
            res.users.map((prop, key) => {
              return {
                id: prop.id,
                username: prop.username,
                email: prop.email,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
                    {/* use this button to add a like kind of action */}
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        let obj = res.users.find(o => o.id === prop.id);
                        alert(
                          "Username: " +
                            obj.username +
                            ", \nEmail: "+
                            obj.email +
                            "\n"
                        );
                      }}
                      color="info"
                      className="like"
                    >
                      <Favorite />
                    </Button>
                  </div>
                )
              };
            })
          );
      } else if(res.hasOwnProperty('success') && res.success === false) {
        setModalTitle('Error');
        setModalContent(res.status);
        setShowModal(true);
      }
    }, error => {
      setModalTitle('Error');
      setModalContent(error);
      setShowModal(true);        
    })
  }, []);

  const closeModal = () => {
    setShowModal(false);
    dispatch(LogoutAction(history));
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>User Table</h4>
          </CardHeader>
          <CardBody style={{ padding: "20px 40px 50px 40px"}}>
            <ReactTable
              columns={[
                {
                  Header: "ID",
                  accessor: "id"
                },
                {
                  Header: "Username",
                  accessor: "username"
                },
                {
                  Header: "Email",
                  accessor: "email"
                },
                {
                  Header: "Actions",
                  accessor: "actions"
                }
              ]}
              data={data}
            />
          </CardBody>
          <MessageBox title={modalTitle} content={modalContent} show={showModal} onClose={() => closeModal()} />
        </Card>
      </GridItem>
    </GridContainer>
  );
}
