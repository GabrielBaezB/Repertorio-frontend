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
        SONAR_PROJECT_NAME = 'repertorio'
    }

    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip unit tests')
        choice(name: 'ENVIRONMENT', choices: ['none', 'development', 'production'], description: 'Deployment environment')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                jobcacher(name: 'node-modules', paths: ['node_modules']) {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint & Security Scan') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npx ng lint'
                    }
                }
                stage('Security Scan') {
                    steps {
                        sh 'npm audit --json --audit-level=high'
                    }
                }
            }
        }

        stage('Unit Tests') {
            when { expression { !params.SKIP_TESTS } }
            steps {
                sh 'npm test -- --browsers ChromeHeadless --watch=false'
            }
        }

        stage('Static Analysis (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
                            -Dsonar.projectVersion=${env.BUILD_NUMBER} \
                            -Dsonar.sources=src \
                            -Dsonar.tests=src \
                            -Dsonar.test.inclusions='**/*.spec.ts' \
                            -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                            -Dsonar.coverage.exclusions='**/*.spec.ts,**/*.module.ts,**/environment*.ts' \
                            -Dsonar.verbose=true
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

        stage('Build') {
            steps {
                script {
                    def config = params.ENVIRONMENT == 'production' ? 'production' : 'development'
                    sh "npx ng build --configuration=${config}"
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Deploy') {
            when { expression { params.ENVIRONMENT != 'none' } }
            environment {
                DEV_SERVER = credentials('dev-server-creds') // Jenkins credential
                PROD_SERVER = credentials('prod-server-creds') // Jenkins credential
            }
            steps {
                script {
                    def server = params.ENVIRONMENT == 'production' ? env.PROD_SERVER : env.DEV_SERVER
                    def deployPath = params.ENVIRONMENT == 'production' ? '/path/to/production/' : '/path/to/development/'

                    sh """
                        rsync -avz --delete ./dist/browser/ ${server}:${deployPath}
                    """
                }
            }
        }

        stage('Validate Deployment') {
            when { expression { params.ENVIRONMENT != 'none' } }
            steps {
                script {
                    def url = params.ENVIRONMENT == 'production' ? 'https://prod.example.com' : 'https://dev.example.com'
                    sh """
                        for i in {1..10}; do
                            if curl -s -f ${url}; then
                                echo "Deployment validation successful!"
                                exit 0
                            else
                                echo "Attempt \$i/10 failed, retrying in 10s..."
                                sleep 10
                            fi
                        done
                        echo "Deployment validation failed!"
                        exit 1
                    """
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            emailext (
                subject: "BUILD SUCCESS: ${currentBuild.fullDisplayName}",
                body: "El pipeline se ha ejecutado correctamente. Ver detalles: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        failure {
            emailext (
                subject: "BUILD FAILED: ${currentBuild.fullDisplayName}",
                body: "El pipeline ha fallado. Ver detalles: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
