pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: env.GIT_REPO_URL,
            credentialsId: env.CREDENTIALS_ID
          ]]])
        }
      }
      stage('并行阶段 1') {
        parallel {
          stage('依赖npm依赖') {
            steps {
              sh '''cd frontend
npm install --registry=https://registry.npm.taobao.org'''
            }
          }
          stage('安装cloudbase') {
            steps {
              sh 'npm install --registry=https://registry.npm.taobao.org -g @cloudbase/cli '
            }
          }
        }
      }
      stage('cloudbase身份认证') {
        steps {
          sh 'npm run login'
        }
      }
      stage('编译发布') {
        steps {
          sh 'npm run deploy:frontend'
        }
      }
    }
  }