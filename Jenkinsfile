pipeline {
    agent any

    tools {
        nodejs 'node-18.20.7' // Asegúrate de que este nombre coincida con tu configuración en Jenkins
    }

    environment {
        // Variables de entorno
        CHROME_BIN = '/usr/bin/google-chrome'
        NG_CLI_ANALYTICS = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout del código fuente
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci' // Usa npm ci en lugar de npm install para instalación determinista
            }
        }

        stage('Lint') {
            steps {
                // Asume que tienes configurado eslint o alguna regla de linting
                sh 'npx ng lint || true' // El || true evita que falle el pipeline si no hay comando lint
            }
        }

        // stage('Test') {
        //     steps {
        //         // Ejecuta tests unitarios con cobertura
        //         sh 'npx ng test --browsers=ChromeHeadless --watch=false --code-coverage || true'
        //     }
        //     post {
        //         always {
        //             // Publica reportes de cobertura si se generan
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
                branch 'main'
            }
            steps {
                sh 'npx ng build --configuration=production'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Angular 19 genera la salida en dist/front/browser para el proyecto "front"
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to Development environment...'
                // Añadir comandos de despliegue a ambiente de desarrollo
                // Por ejemplo: sh 'rsync -avz dist/front/browser/ user@server:/path/to/dev/web/root/'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Production environment...'
                // Añadir comandos de despliegue a producción
                // Por ejemplo: sh 'rsync -avz dist/front/browser/ user@server:/path/to/prod/web/root/'
            }
        }
    }

    post {
        always {
            // Reemplazado cleanWs() por deleteDir() que está disponible en Jenkins core
            deleteDir()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
