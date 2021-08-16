import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Icon } from 'tapis-ui/_common';
import { Card, CardHeader, CardBody, CardTitle, CardFooter, CardText } from 'reactstrap';
import { useApps, useJobs  } from 'tapis-redux';
import { useTapisConfig } from 'tapis-hooks';
import { LoadingSpinner } from 'tapis-ui/_common';
import { useList as useSystemsList } from 'tapis-hooks/systems';
import styles from './Dashboard.module.scss';
import './Dashboard.scss';

type DashboardCardProps = {
  icon: string,
  link: string,
  counter: string,
  name: string,
  text: string,
  loading: boolean
}

const DashboardCard: React.FC<DashboardCardProps> = ({icon, link, counter, name, text, loading}) => {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <div  className={styles['card-header']}>
          <div>
            <Icon name={icon} className="dashboard__card-icon"/>
          </div>          
          <div>
            {name}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <CardTitle tag="h5">
          {
            loading 
              ? <LoadingSpinner placement="inline" />
              : <div>{counter}</div>
          }
        </CardTitle>
        <CardText>
          {text}
        </CardText>
      </CardBody>
      <CardFooter className={styles['card-footer']}>
        <Link to={link}>Go to {name}</Link>
        <Icon name="push-right" />
      </CardFooter>
    </Card>
  )
}

const Dashboard: React.FC = () => {
  const { accessToken } = useTapisConfig();
  const systems = useSystemsList({});
  const jobs = useJobs();
  const apps = useApps();

  return (
    <div>
      <SectionHeader className="dashboard__section-header">Dashboard for {process.env.REACT_APP_TAPIS_TENANT_URL}</SectionHeader>
      <div className={styles.header}>
        <h5>Welcome to TAPIS-UI</h5>
        <div>
          This web application demonstrates how to leverage the TAPIS API and <i>tapis-ui</i> React components
          to build a serverless interface for High Performance Computing systems.
        </div>
      </div>
      <div className={styles.cards}>
        {
          accessToken ? (
            <>
              <DashboardCard
                icon="data-files"
                name="Systems"
                text="Access TAPIS systems and files"
                link="/systems"
                counter={`${systems?.data?.result?.length} systems`}
                loading={systems?.isLoading}
              />
              <DashboardCard
                icon="applications"
                name="Applications"
                text="View TAPIS applications and launch jobs"
                link="/apps"
                counter={`${apps.apps.results.length} apps`}
                loading={apps.apps.loading}
              />
              <DashboardCard
                icon="jobs"
                name="Jobs"
                text="View status and details for previously launched TAPIS jobs"
                link="/jobs"
                counter={`${jobs.jobs.results.length} jobs`}
                loading={jobs.jobs.loading}
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <div className={styles['card-header']}>
                  <div>
                    <Icon name="user" className="dashboard__card-icon"/>
                  </div>          
                  <div>
                    You are not logged in
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <CardTitle>
                  Please log in to use TAPIS
                </CardTitle>
              </CardBody>
              <CardFooter className={styles['card-footer']}>
                <Link to="/login">Proceed to login</Link>
                <Icon name="push-right" /> 
              </CardFooter>
            </Card>
          )
        }

      </div>
    </div>
  ) 
}

export default Dashboard;
