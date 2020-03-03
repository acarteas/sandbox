/********************************************************************************
** Form generated from reading UI file 'QtTest1.ui'
**
** Created by: Qt User Interface Compiler version 5.12.6
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_QTTEST1_H
#define UI_QTTEST1_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_QtTest1Class
{
public:
    QWidget *centralWidget;
    QVBoxLayout *verticalLayout;
    QSpacerItem *verticalSpacer_2;
    QHBoxLayout *horizontalLayout;
    QLineEdit *firstInput;
    QLabel *label;
    QLineEdit *secondInput;
    QLabel *label_2;
    QLabel *resultText;
    QPushButton *calculateButton;
    QSpacerItem *verticalSpacer;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *QtTest1Class)
    {
        if (QtTest1Class->objectName().isEmpty())
            QtTest1Class->setObjectName(QString::fromUtf8("QtTest1Class"));
        QtTest1Class->resize(600, 351);
        centralWidget = new QWidget(QtTest1Class);
        centralWidget->setObjectName(QString::fromUtf8("centralWidget"));
        verticalLayout = new QVBoxLayout(centralWidget);
        verticalLayout->setSpacing(6);
        verticalLayout->setContentsMargins(11, 11, 11, 11);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        verticalSpacer_2 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout->addItem(verticalSpacer_2);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setSpacing(7);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        firstInput = new QLineEdit(centralWidget);
        firstInput->setObjectName(QString::fromUtf8("firstInput"));

        horizontalLayout->addWidget(firstInput);

        label = new QLabel(centralWidget);
        label->setObjectName(QString::fromUtf8("label"));

        horizontalLayout->addWidget(label);

        secondInput = new QLineEdit(centralWidget);
        secondInput->setObjectName(QString::fromUtf8("secondInput"));

        horizontalLayout->addWidget(secondInput);

        label_2 = new QLabel(centralWidget);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        horizontalLayout->addWidget(label_2);

        resultText = new QLabel(centralWidget);
        resultText->setObjectName(QString::fromUtf8("resultText"));
        resultText->setMinimumSize(QSize(75, 0));

        horizontalLayout->addWidget(resultText);


        verticalLayout->addLayout(horizontalLayout);

        calculateButton = new QPushButton(centralWidget);
        calculateButton->setObjectName(QString::fromUtf8("calculateButton"));

        verticalLayout->addWidget(calculateButton);

        verticalSpacer = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout->addItem(verticalSpacer);

        QtTest1Class->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(QtTest1Class);
        menuBar->setObjectName(QString::fromUtf8("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 600, 26));
        QtTest1Class->setMenuBar(menuBar);
        mainToolBar = new QToolBar(QtTest1Class);
        mainToolBar->setObjectName(QString::fromUtf8("mainToolBar"));
        QtTest1Class->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(QtTest1Class);
        statusBar->setObjectName(QString::fromUtf8("statusBar"));
        QtTest1Class->setStatusBar(statusBar);

        retranslateUi(QtTest1Class);

        QMetaObject::connectSlotsByName(QtTest1Class);
    } // setupUi

    void retranslateUi(QMainWindow *QtTest1Class)
    {
        QtTest1Class->setWindowTitle(QApplication::translate("QtTest1Class", "QtTest1", nullptr));
        label->setText(QApplication::translate("QtTest1Class", "+", nullptr));
        label_2->setText(QApplication::translate("QtTest1Class", "=", nullptr));
        resultText->setText(QString());
        calculateButton->setText(QApplication::translate("QtTest1Class", "Calculate", nullptr));
    } // retranslateUi

};

namespace Ui {
    class QtTest1Class: public Ui_QtTest1Class {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_QTTEST1_H
