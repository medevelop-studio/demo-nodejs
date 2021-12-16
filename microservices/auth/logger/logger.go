package logger

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/natefinch/lumberjack"
	"github.com/olivere/elastic"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var elasticClient *elastic.Client = nil

func CreateLogger(filename string, logLevel zapcore.Level) *zap.Logger {
	hostname, _err := os.Hostname()
	if _err != nil {
		fmt.Print(_err)
	}

	w := zapcore.AddSync(&lumberjack.Logger{
		Filename:   fmt.Sprintf("log/%s.%s.%s.log", filename, time.Now().Format("2006-01-02"), hostname),
		MaxSize:    100, // megabytes
		MaxBackups: 3,
		MaxAge:     3, // days
	})

	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.TimeKey = "timestamp"
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		w,
		logLevel,
	)

	logger := zap.New(core)

	return logger
}

func CreateElasticSearchClient() *elastic.Client {
	if elasticClient == nil {
		client, err := elastic.NewClient(elastic.SetURL(os.Getenv("elasticsearch_url")))
		if err != nil {
			panic(err)
		}
		elasticClient = client
	}

	return elasticClient
}

func AddRecordToElasticServer(logType string, msg string) {
	if elasticClient == nil {
		CreateElasticSearchClient()
	}

	ctx := context.Background()
	_, err := elasticClient.
		Index().
		Index("log-auth-" + logType + "_" + time.Now().Format("2006-01-02")).
		Type("_doc").
		BodyString(msg).
		Do(ctx)

	// fmt.Println(ind)

	if err != nil {
		fmt.Println(msg)
		fmt.Println(">>>>>>>>>>>>>>>>>>>>> msg <<<<<<<<<<<<<<<<<<")
	}
}
