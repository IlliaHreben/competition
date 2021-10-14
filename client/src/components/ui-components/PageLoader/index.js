import styles from './PageLoader.less';

function PageLoader () {
    return (
        <div className={styles.loadingPage}>
            <span className={styles.loader} />
        </div>
    );
}

export default PageLoader;
