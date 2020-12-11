#include "QtTest1.h"
#include <QtCore>
#include <QtGui>
QtTest1::QtTest1(QWidget *parent)
	: QMainWindow(parent)
{
	ui.setupUi(this);
}


void QtTest1::on_calculateButton_clicked()
{
	auto first_number = ui.firstInput->text().toInt();
	auto second_number = ui.secondInput->text().toInt();
	int result = first_number + second_number;
	ui.resultText->setText(QString::number(result));
}