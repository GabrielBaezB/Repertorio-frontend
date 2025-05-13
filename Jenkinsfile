pipeline {
    agent any

    tools {
        nodejs 'node-18.20.7'
    }

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        NG_CLI_ANALYTICS = 'false'
        SONAR_SCANNER_HOME = tool 'repertorioQubeScanner'
        SONAR_PROJECT_KEY = 'repertorio-qube-key'
        SONAR_PROJECT_NAME = 'Repertorio'
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                // Cache node_modules para builds futuros
                cache(path: './node_modules', key: "${env.JOB_NAME}-${hashFiles('**/package-lock.json')}")
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx ng lint || true'
                recordIssues(tools: [esLint(pattern: 'eslint-report.json')])
            }
        }

        // stage('Test') {
        //     steps {
        //         sh 'npx ng test --browsers=ChromeHeadless --watch=false --code-coverage || true'
        //     }
        //     post {
        //         always {
        //             publishHTML(target: [
        //                 allowMissing: true,
        //                 alwaysLinkToLastBuild: false,
        //                 keepAll: true,
        //                 reportDir: 'coverage/front',
        //                 reportFiles: 'index.html',
        //                 reportName: 'Coverage Report'
        //             ])
        //         }
        //     }
        // }

        stage('Static Code Analysis with SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
                        -Dsonar.projectVersion=${env.BUILD_NUMBER} \
                        -Dsonar.sources=src \
                        -Dsonar.typescript.lcov.reportPaths=coverage/front/lcov.info \
                        -Dsonar.javascript.lcov.reportPaths=coverage/front/lcov.info
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --json || true'
                // Opcional: dependencyCheck additionalArguments: '--scan node_modules', odcInstallation: 'OWASP-DC'
            }
        }

        stage('Build for Development') {
            when {
                branch 'develop'
            }
            steps {
                sh 'npx ng build --configuration=development'
            }
        }

        stage('Build for Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
                }
            }
            steps {
                sh 'npx ng build --configuration=production'
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to Development environment...'
                // Ejemplo para despliegue con Docker
                // sh "ssh user@dev-server 'docker pull username/${SONAR_PROJECT_KEY}:dev-${env.BUILD_NUMBER} && docker-compose up -d'"
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
                }
            }
            steps {
                // Requiere aprobación manual para desplegar a producción
                input message: '¿Desplegar a producción?', ok: 'Sí'
                echo 'Deploying to Production environment...'
                // Ejemplo para despliegue con Docker
                // sh "ssh user@prod-server 'docker pull username/${SONAR_PROJECT_KEY}:prod-${env.BUILD_NUMBER} && docker-compose up -d'"
            }
        }
    }

    post {
        always {
            // Limpieza
            sh 'docker rmi $(docker images -q -f dangling=true) || true'
            deleteDir()
        }
        success {
            echo 'Pipeline executed successfully!'
            slackSend(color: 'good', message: "ÉXITO: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        failure {
            echo 'Pipeline execution failed!'
            slackSend(color: 'danger', message: "FALLO: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}
