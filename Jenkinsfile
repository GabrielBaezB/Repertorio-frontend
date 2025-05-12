pipeline {
  agent any
  environment {
    NODEJS_HOME = tool name: 'NodeJS 18', type: 'nodejs'
    PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    SONAR_HOST_URL = credentials('SONAR_HOST_URL')
    SONAR_AUTH_TOKEN = credentials('reperotiro-qube-key')
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install dependencies') {
      steps { sh 'npm install' }
    }
    stage('Build') {
      steps { sh 'npm run build -- --prod' }
    }
    // … el resto de tus stages …
  }
  post {
    always { archiveArtifacts artifacts: 'dist/front/browser/**', allowEmptyArchive: true }
    cleanup { cleanWs() }
  }
}
