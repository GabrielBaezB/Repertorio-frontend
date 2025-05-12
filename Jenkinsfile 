pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS 18', type: 'nodejs'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"

        // Credenciales con SonarQube (configuradas en Jenkins Credentials)
        SONAR_HOST_URL = credentials('SONAR_HOST_URL')
        SONAR_AUTH_TOKEN = credentials('reperotiro-qube-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build -- --prod'
            }
        }

        stage('Unit Tests') {
            steps {
                // sh 'npm test -- --watch=false --browsers=ChromeHeadless'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_SCANNER = tool 'SonarScanner'
            }
            steps {
                withSonarQubeEnv('MySonarQubeServer') {
                    sh "${SONAR_SCANNER}/bin/sonar-scanner \
                        -Dsonar.projectKey=frontend \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_AUTH_TOKEN}"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        always {
            // Archiva los artifacts de build para revisarlos
            archiveArtifacts artifacts: 'dist/front/browser/**', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}
